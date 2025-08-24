import 'dotenv/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import OpenAI from 'openai';
import Chat from '../models/chat.models.js'

const client = new OpenAI();

export const createMessage = async(req,res)=>{
    try {
        const {message} = req.body;
        const userId = req.user._id;
        const rewrittingQuery = `
        You are an expert query writter. Fix all the typo's and add more context 
        to the wuery so it can fetch more relevant data.
        Output should be a single string having query
        for example : 'What is asynchronous function'

        user query :- ${message}
         `
         

        const response = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : rewrittingQuery
            }],
        }); 

         const refinedQuery = response.choices[0].message.content ;

          const embeddings = new OpenAIEmbeddings({
                model: 'text-embedding-3-large',
            });
         const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName: 'Chai-Subtitles',
            }
        );
        const vectorSearcher = vectorStore.asRetriever({
            k: 3,
        });
        const relevantChunk = await vectorSearcher.invoke(refinedQuery);
        const gettingBetterChunksPrompt = `
            You are an expert query writer. Your work is to check the quality of relevant chunks and to find the least relevant chunk. 
            and you have to optimize the prompt such that quality of chunks improve according to the query . The query should be same as 
            the original user's query so that user get's the most accurate answer . 
            Output should be a single string that will be the optimized query . 
            for example :- 'What is asynchronous functions in javascript'
            user's orignial query :- ${message}
            user's query with fixed typo and more context :- ${refinedQuery}
            relavent chunks fetched :- ${relevantChunk}
        `
         const response2 = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : gettingBetterChunksPrompt
            }],
        }); 

         const refinedQuery2 = response2.choices[0].message.content ;

         const longAnswer = `
            You are a teacher who teaches coding . You are an expert in coding . Your work is to answer the user's query in exact 200 
            words(should be as close as possible). The answer should be precise and should have all the needed information . 
            Output should be a single string which will be answer . 
            for example :- 'Answer having 200 words'
            user query :- ${refinedQuery}
         `
         const response3 = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : longAnswer
            }],
        }); 

         const refinedQuery3 = response3.choices[0].message.content ;

         const subqueryPrompt = `
            You are an expert in writing sub query . That is you will be given a query , you will have to reframe the query in a different 
            way but it should have the same meaning but have some better context . 
            Output should be a single string which will be the subquery .
            for example :- 'Sub query for the user query'
            User query :- ${refinedQuery}
         `
          const response4 = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : subqueryPrompt
            }],
        }); 

         const subquery = response4.choices[0].message.content ;

         const subqueryPrompt2 = `
            You are an expert in writing sub query . That is you will be given a query , you will have to reframe the query in a different 
            way but it should have the same meaning but have some better context . 
            Output should be a single string which will be the subquery .
            for example :- 'Sub query for the user query'
            User query :- ${refinedQuery}
            Subquery should not be same as or match :- ${subquery}
         `
         const response5 = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : subqueryPrompt2
            }],
        }); 

         const subquery2 = response5.choices[0].message.content ;

         const relevantChunk2 = await vectorSearcher.invoke(refinedQuery2);
         const relevantChunk3 = await vectorSearcher.invoke(refinedQuery3);
         const relevantChunk4 = await vectorSearcher.invoke(subquery);
         const relaventChunk5 = await vectorSearcher.invoke(subquery2);

         const allChunks = [...relevantChunk2 , ...relevantChunk3 , ...relevantChunk4 , relaventChunk5];

         const freqMap = new Map();

         allChunks.forEach((chunk, index)=>{
            const key = JSON.stringify(chunk)
            if(!freqMap.has(key)){
                freqMap.set(key , { count : 1 ,firstIndex : index})
            }else{
                freqMap.get(key).count++;
            }
         })

         const sortedChunks = [...freqMap.entries()].sort((a,b)=>{
            const [chunkA , dataA] = a;
            const [chunkB , dataB] = b ;
            if(dataB.count !== dataA.count){
                return dataB.count - dataA.count;
            }

            return dataA.firstIndex - dataB.firstIndex;
         })

         const priorityChunks = sortedChunks.slice(0,5).map(([chunk])=>JSON.parse(chunk));

         const systemPrompt = `
            You are an Assistant who is expert in answering the query of students with the given context . Answer only with the given context which is a VTT(subtitles) data 
            .Your work is to answer the student's query and guide them through the course to the correct resources . 
            You will answer the query of the student , and then tell him the where he can find it's resources in which course , in which chapter
            , in which video and at what timestamps , You will give all giving timestamps is must . 
            Output should be a single string having the answer . 
            Output example  :- "An **asynchronous function** in JavaScript allows code to run without blocking the main thread. It uses the async
             keyword and often works with await to handle promises. This enables smooth execution of tasks like API calls or file operations without 
             freezing the UI.

             - You can find this in Chai aur Javascript course .
             - This topic is covered in chapter named "Promises, Callbacks, and Async/Await in JavaScript"
             - in video named "Async/Await in JS " from 00:05:00.100 till 00:08:30.400 , 
             - It will take you three and half minute to cover this topic by watching video"

             context :- ${JSON.stringify(priorityChunks)}

             IMPORTANT :- 
             - Answer only from the available context , do not answer on your own 
             - Do not imagine anything on your own 

            
         `

         let chat = await Chat.findOne({
            userId
        });

        if(!chat){
            chat= await Chat.create({
                userId
            })
        }

        let messages = chat.messages || [];

         messages.push({
            role: 'user',
            content : message
        })
        const systemMessage = {
            role : 'system',
            content : systemPrompt
        }

        const totalMessage = [systemMessage , ...messages];

        const realResponse = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: totalMessage,
        }); 

        const refinedResReal = realResponse.choices[0].message.content ;
        
         messages.push({
            role : 'assistant',
            content : refinedResReal
        })

        chat.messages = messages;
        await chat.save();

         return res.status(200).json({
            success: true , 
            message : 'Received response successfully',
            response: refinedResReal , 
            messages ,
            chat

        })






        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal error while chatting'
        })
        
    }
    
}
export const getChats = async(req,res)=>{
    try {
         const userId = req.user._id;
        
         if(!userId){
            return res.status(400).json({
                success : false ,
                message : 'Not Authorized'
            })
        }

        

        const chats = await Chat.find({
            userId
            
        });
        if(!chats){
            return res.status(200).json({
                success: true , 
                chats,
                message : "No message in chat"
            })
        }

         return res.status(200).json({
                success: true , 
                chats,
                message : "Messages fetched"
            })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false ,
            message : "Internal error while fetching chats"
        })
        
        
    }

}
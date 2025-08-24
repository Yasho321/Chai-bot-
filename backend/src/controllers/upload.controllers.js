import 'dotenv/config'

import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import fs from 'fs-extra'
import path from "path";
import { Document } from "@langchain/core/documents";
import Video from '../models/video.models.js';
import Course from '../models/course.models.js';
import Chapter from '../models/chapter.models.js';

export const uploadVtts = async (req,res)=>{
    try {
        const {courseId , chapterId} = req.params;
        const uploadedVTTS = req.files; 
        if (!uploadedVTTS || uploadedVTTS.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No VTT files uploaded"
            });
        }
        for(const element of uploadedVTTS){
             const filePath = element.path;
            const loader = new TextLoader(filePath);
            const docs = await loader.load();
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 750,
                chunkOverlap: 150,
            });
             const chunks = await splitter.splitDocuments(docs);
              const embeddings = new OpenAIEmbeddings({
                model: 'text-embedding-3-large',
            });
            const newVideo = await Video.create({
                title : path.parse(element.originalname).name,
                course : courseId,
                chapter : chapterId,

            })
            if(!newVideo){
                return res.status(400).json({
                    success : false,
                    message : 'Failed to create new Video vtt'
                })
            }
            const course = await Course.findById(courseId);
            const courseName = course.title ;
            const chapter = await Chapter.findById(chapterId);
            const chapterName= chapter.title;
            const documents = chunks.map(chunk => new Document({
                pageContent: chunk.pageContent,
                metadata: {
                    course: courseName,
                    chapter: chapterName,
                    videoTitle: path.parse(element.originalname).name,
                },
                }));
            
            const vectorStore = await QdrantVectorStore.fromDocuments(documents , embeddings, {
                url: process.env.QDRANT_URL,
                apiKey: process.env.QDRANT_API_KEY,
                collectionName: 'Chai-Subtitles',
            });

            await fs.promises.unlink(filePath);
        }
        return res.status(200).json({
            success:true , 
            message:'VTT files indexed successfully'
        })
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false , 
            message : "Failed to index vtt files"
        })
        
        
    }
    
}
import Chapter from "../models/chapter.models.js";

export const createChapter= async(req,res)=>{
     try {
            const {chapterName, courseId} = req.body;
            if(!chapterName || !courseId){
                return res.status(400).json({
                    success:false ,
                    message : "No chapter name or course id provided"
                })
            }
            const newChapter = await Chapter.create({
                title : chapterName,
                course : courseId
            });
            if(!newChapter){
                 return res.status(400).json({
                    success:false ,
                    message : "Failed to create chapter"
                })
            }
            return res.status(201).json({
                success:true,
                message:'Chapter created successfully',
                chapter : newChapter
            })
            
        } catch (error) {
            console.log(error);
             return res.status(500).json({
                    success:false ,
                    message : "Internal error while creating Chapter"
                })
            
            
        }

}
export const getChapters = async(req,res)=>{
    try {
        const chapters = await Chapter.find();
        if(!chapters){
             return res.status(400).json({
                success:false ,
                message : "No chapters found"
            })
        }
         return res.status(200).json({
                success:true ,
                message : "chapters fetched succesfully",
                chapters
            })
        
    } catch (error) {
        console.log(error);
         return res.status(500).json({
                success:false ,
                message : "Internal error while getting chapters"
            })
        
    }



}
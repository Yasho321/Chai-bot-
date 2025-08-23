import Course from "../models/course.models.js";

export const createCourse= async(req,res)=>{
    try {
        const {courseName} = req.body;
        if(!courseName){
            return res.status(400).json({
                success:false ,
                message : "No course name provided"
            })
        }
        const newCourse = await Course.create({
            title : courseName
        });
        if(!newCourse){
             return res.status(400).json({
                success:false ,
                message : "Failed to create course"
            })
        }
        return res.status(201).json({
            success:true,
            message:'Course created successfully',
            course : newCourse
        })
        
    } catch (error) {
        console.log(error);
         return res.status(500).json({
                success:false ,
                message : "Internal error while creating course"
            })
        
        
    }
}
export const getCourses = async(req,res)=>{
    try {
        const courses = await Course.find();
        if(!courses){
             return res.status(400).json({
                success:false ,
                message : "No course found"
            })
        }
         return res.status(200).json({
                success:true ,
                message : "Courses fetched succesfully",
                courses

            })
        
    } catch (error) {
        console.log(error);
         return res.status(500).json({
                success:false ,
                message : "Internal error while getting courses"
            })
        
    }


}
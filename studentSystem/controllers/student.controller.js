import Student from "../models/student.model.js";

export const createStudent = async (req, res) => {
  try {
    const { name, rollNo, email, studentClass, marks } = req.body;
    if (!name || !rollNo || !email || !studentClass || !marks) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const existingRollNo = await Student.findOne({ rollNo });
    if (existingRollNo) {
      return res.status(409).json({
        success: false,
        message: "Roll No already exist please type another ",
      });
    }
    const newStudent = await Student.create({
      name,
      rollNo,
      email,
      studentClass,
      marks,
    });

    res.status(201).json({
      success: true,
      message: "Student created Successfully",
      student: newStudent,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "ERROR in create  students controller",
      error: error.message,
    });
  }
};

export const getAllStudents = async (_, res) => {
  try {
    const allStudents = await Student.find();
    res.status(201).json({
      success: true,
      message: "All Students",
      students: allStudents,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "ERROR in get all students controller",
      error: error.message,
    });
  }
};
export const delStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log(studentId);
    const deleteStudent = await Student.findByIdAndDelete(studentId);
    if (!deleteStudent) {
      return res
        .status(404)
        .json({ messge: "student not fount", success: false });
    }
    res.status(200).json({
      success: true,
      message: "Student Deleted Successfuly",
      student: deleteStudent,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "ERROR in Deleting student controller",
      error: error.message,
    });
  }
};


export const updateStudent = async(req,res)=>{
    try {
        const {email, name, rollNo, studentClass, marks} = req.body
        const {id} = req.params
        if (!name || !rollNo || !email || !studentClass || !marks) {
            return res.status(400).json({
              message: "All fields are required",
              success: false,
            });
          }
        const  update = await Student.findByIdAndUpdate(id,{
            email,name,rollNo, studentClass, marks
        },{new:true})
        if(!update){
            return res.status(404).json({success:false, messsage:"Student Not found"})
        }
            res.status(200).json({message:"Student updated Successfully", success:true, updatedStudent: update})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
          success: false,
          message: "ERROR in update student controller",
          error: error.message,
        });
    }
}

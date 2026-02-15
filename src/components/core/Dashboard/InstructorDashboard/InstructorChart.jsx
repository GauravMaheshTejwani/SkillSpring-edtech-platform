import React, { useState } from 'react'
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables);

function InstructorChart({courses}) {

    const [currChart, setCurrChart] = useState("students");

    const getRandomColors = (numColors) => {
        const colors = [];
        for(let i=0; i<numColors; i++){
            const color = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`
            colors.push(color);
        }
        return colors;
    }

    //create student ka data

    const charDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }

    //create income ka data

    const charDataForIncome = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }

    const options = {

    }

  return (
    <div>
        <p>Visualise</p>
        <div className=' flex gap-x-5'>
            <button
            onClick={()=>setCurrChart("students")}
            >
                Student
            </button>

            <button
            onClick={()=>setCurrChart("instructor")}
            >
                Instructor
            </button>
        </div>

        <div>
            <Pie
                data={currChart === "students" ? charDataForStudents : charDataForIncome}
                options={options}
            />
        </div>
    </div>
  )
}

export default InstructorChart
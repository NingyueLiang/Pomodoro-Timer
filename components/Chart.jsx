import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector } from "recharts";
import {db, auth } from "../firebase/clientApp"
import { addDoc, getDocs,deleteDoc, doc, collection } from "firebase/firestore";



const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Total Time: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Percent: ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


function Chart(props) {
  const [tasks,setTasks] = useState([]);
  const postsCollectionRef = collection(db, `users/${auth.currentUser.uid}/todos`);
  const getItems = async () => {
    const data = await getDocs(postsCollectionRef);
    setTasks(data.docs.map((doc) => ({...doc.data()})));
    
  };
 
  getItems();
  const data = tasks.map(({inputText, totalTime}) => ({name: inputText, value: totalTime}))

  

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  function back_main(){
    const url = 'https://foocus.vercel.app';
    window.open(url, '_self');
  }

  return (
    <div className="chart">
      <h1>Time Spent on Each Task:</h1>
      <PieChart width={600} height={600} id = "pie">
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx={300}
          cy={300}
          innerRadius={90}
          outerRadius={120}
          fill="#50a3a2"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
      <button onClick={back_main}>Close</button>
    </div>
  );
    
}

export default Chart;

import React, { useCallback, useState, useEffect } from "react";
import { PieChart, Pie, Sector, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {db, auth } from "../firebase/clientApp"
import { addDoc, getDocs,deleteDoc, doc, collection,where ,query } from "firebase/firestore";
import { Button, Center, WrapItem, Wrap, Text, Heading, Box } from '@chakra-ui/react'
import PropTypes from 'prop-types';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header";

//bar chart
const colors = scaleOrdinal(schemeCategory10).range();

const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

TriangleBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};


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
 
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [noData, setNoData] = useState(false);
  
  const postsCollectionRef = collection(db, `users/${auth.currentUser.uid}/todos`);
  
    
  

  useEffect(() => {
    const getItems = async () => {
      let data;
      if(startDate != null && endDate != null){
        data = await getDocs(query(postsCollectionRef, where('createDate', '>=', startDate), where('createDate', '<', endDate)));
        
      }else{
        data = await getDocs(postsCollectionRef);
        
      }
      setTasks(data.docs.map((doc) => ({...doc.data()})));
      
      
    };
    getItems();
    
    
   
  }, []);
  
  const data = tasks.map(({inputText, totalTime}) => ({name: inputText, value: totalTime}))
  
  useEffect(() => {
    if(tasks.length == 0){
      setNoData(true);
      
    }else{
      setNoData(false);
    }
  });

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

    <>
    <Center>
     <Heading as='h1' size='xl' isTruncated marginBlockStart={15} marginBlockEnd={'15'}>Time Spent On Each Task:</Heading>
    </Center>
    <Center>
      <Heading as='h2' size='sm' isTruncated >Unit: Min</Heading>
    </Center>
     {noData && 
     <>
      <Center>
        <Heading as='h2' size='sm' isTruncated marginBlockEnd={'15'}> Please select the range of dates your report shows(All time by default):</Heading> 
      </Center>
      <Center>
       <Wrap spacing={10}>
        <WrapItem >
          <Heading as='h3' size='md' marginRight={'5'}>StartDate: </Heading>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </WrapItem>
        <WrapItem>
          <Heading as='h3' size='md' marginRight={'5'}>EndDate: </Heading>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </WrapItem>
      </Wrap>
      </Center>
        
    <Center>
      <Heading marginBlockStart={10}>No Tasks Created Within This Range.</Heading>
    </Center>
     <Center>
        
        <Button mx={5} my={5} colorScheme='green' variant='solid' onClick={back_main}>Go Back</Button>
      </Center>
     </>}
     {!noData &&
     <>
      <Center>
        <Heading as='h2' size='sm' isTruncated marginBlockEnd={'15'}> Please select the range of dates your report shows(All time by default):</Heading> 
      </Center>
      <Center>
       <Wrap spacing={10}>
        <WrapItem >
          <Heading as='h3' size='md' marginRight={'5'}>StartDate: </Heading>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </WrapItem>
        <WrapItem>
          <Heading as='h3' size='md' marginRight={'5'}>EndDate: </Heading>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </WrapItem>
      </Wrap>
      </Center>
      
      <Wrap>
        <WrapItem>
          <Center>
            <PieChart width={800} height={800} 
            margin={{
              
              left: 70,
              
            }}>
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
          </Center>
        </WrapItem>
        <WrapItem>
          <Center>
            <BarChart
              width={700}
              height={500}
              data={data}
              margin={{
                top: 50,
                right: 30,
                left: 70,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'left' }}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                ))}
              </Bar>
            </BarChart>
          </Center>
        </WrapItem>
      </Wrap>
      <Center >
        <Button mx={5} my={5} colorScheme='green' variant='solid' onClick={back_main}>Go Back</Button>
      </Center>
      
      
    </>
        } 
    </>  
       
    
  );
    
}

export default Chart;
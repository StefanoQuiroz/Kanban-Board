import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button } from 'reactstrap';
import { BsXCircleFill, BsChevronRight } from "react-icons/bs";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
const PMList = (props) => {

    const history = useHistory();
    const pmNew = (event) => {
        history.push("/projects/new")
    }

    const dashBoard = (event) => {
        history.push("/projects")
    }

    const {datos, setDatos} = props;
   
    const [backLog, setBackLog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);

    useEffect(()=>{
        axios.get("/api/project/BACKLOG")
            .then(response => setBackLog(response.data.data))
            .catch(err => Swal.fire({
                icon: "error",
                title: "Loading error data",
                text: "An error occurred to loading data"
            }))
        axios.get("/api/project/IN_PROGRESS")
            .then(response => setInProgress(response.data.data))
            .catch(err => Swal.fire({
                icon: "error",
                title: "Loading error data",
                text: "An error occurred to loading data"
            }))
        axios.get("/api/project/COMPLETED")
            .then(response => setCompleted(response.data.data))
            .catch(err => Swal.fire({
                icon: "error",
                title: "Loading error data",
                text: "An error occurred to loading data"
            }))
    },[props.actualizar])


    const startProject = (event, id) => {
        const project = backLog.find(p => p._id === id);
        project.status= 'IN_PROGRESS'
        axios.put(`/api/project/update/${id}`, project)
            .then(response => {
                props.setActualizar(props.actualizar + 1)
                /* const index = backLog.findIndex( objeto => objeto._id === id);
                backLog.splice(index, 1);
                setInProgress(inProgress.concat([response.data.data]))
                setBackLog(backLog);
                dashBoard(event); */
                
            })
            .catch(err => Swal.fire({
                icon: "error",
                title: "Loading error in one project - start",
                text: "An error occurred while find only a project - Progress"
            }))
    }

    //console.log(inProgress);

    const moveToCompleted = (event, id) => {
        const project = inProgress.find(p => p._id === id);
        project.status= 'COMPLETED'
        axios.put(`/api/project/update/${id}`, project)
        .then(response => {
            props.setActualizar(props.actualizar + 1)
            /* const index = inProgress.findIndex( objeto => objeto._id === id);
            inProgress.splice(index, 1);
            setCompleted(completed.concat([response.data.data]))
            setInProgress(inProgress);
            dashBoard(event); */
            //dashBoard(event);
        })
        .catch(err => Swal.fire({
            icon: "error",
            title: "Loading error in one project - move",
            text: "An error occurred while find only a project - Completed"
        }))
    }

    const removeProject = (event, id) => {
        Swal.fire({
            title: 'Remove Project',
            text: 'Ae you sure to remove the project?',
            icon: 'warning',
            showCancelButton: true
        }).then(result => {
            if(result.value) {
                axios.delete(`/api/project/delete/${id}`)
                .then(resp => {
                    const index = completed.findIndex( objeto => objeto._id === id);
                    completed.splice(index, 1);
                    setCompleted(completed);
                    const objeto = props.datos.filter(a => a._id !== id);
                    setDatos(objeto);
                    dashBoard(event); 
                }).catch(error => Swal.fire({
                    icon: "error",
                    title: "Remove Error",
                    text: "Error on Remove projects"
                }))
            }
        })
    }


    return (
        <Row>
            <h1>Kanban Board</h1> 
            <Col xs style={{border:'2px solid black', borderSize:'border-box', margin:'0.03rem', padding:'0'}}>
                <Table>
                    <thead>
                        <tr>
                            <th style={{backgroundColor:'#87ceeb', border:'1px solid black'}}>Backlog</th>
                        </tr>
                    </thead>
                    <tbody>   
                            {backLog && backLog.map((items, index)=>(
                            <tr key={index} >
                                <td style={{border:'2px solid black'}}>
                                    <h5><b>{items.project}</b></h5>
                                    <p>Due: {items.dueDate}</p>
                                    <Button onClick={(event)=>startProject(event, items._id)} block size='lg' style={{width:'100%', backgroundColor:'#fed48b', border:'none', color:'black', fontWeight:'500'}}>Start Project<BsChevronRight style={{float:'right', fontSize:'1.6rem'}}/></Button>
                                </td>
                            </tr>
                            ))}
                    </tbody>
                    
                </Table> 
                
            </Col>
            <Col xs style={{border:'2px solid black', borderSize:'border-box', margin:'0.03rem', padding:'0'}}>
                <Table>
                    <thead>
                        <tr>
                            <th style={{backgroundColor:'#fed48b'}}>In Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inProgress && inProgress.map((items, index)=>(
                        <tr key={index}>
                            <td style={{border:'2px solid black'}}>
                                <h5>{items.project}</h5>
                                <p>{items.dueDate}</p>
                                <Button onClick={(event)=>moveToCompleted(event, items._id)} block size='lg' style={{width:'100%', backgroundColor:'#7fbf7f', border:'none', color:'black', fontWeight:'500'}}>Move To Completed <BsChevronRight style={{float:'right', fontSize:'1.6rem'}}/></Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
            <Col xs style={{border:'2px solid black', borderSize:'border-box', margin:'0.03rem', padding:'0'}}>
                <Table>
                    <thead>
                        <tr>
                            <th style={{backgroundColor:'#7fbf7f'}}>Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completed && completed.map((items, index)=>(
                        <tr key={index}>
                            <td style={{border:'2px solid black'}}>
                                <h5>{items.project}</h5>
                                <p>{items.dueDate}</p>
                                <Button onClick={(event)=>removeProject(event, items._id)} block size='lg' style={{width:'100%', backgroundColor:'#ff6666', border:'none', color:'black', fontWeight:'500'}}>Remove Project <BsChevronRight style={{float:'right', fontSize:'1.6rem'}}/></Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
            <Row style={{margin:' 2rem'}}>
                <Col md={4}>
                    <Button onClick={(event) => pmNew(event)}><BsXCircleFill style={{margin:'0.2rem'}}/>Add New Project</Button>           
                </Col>
            </Row>
        </Row>
    );
}

export default PMList;

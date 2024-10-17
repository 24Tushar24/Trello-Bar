import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

const item1 = {
    id: v4(),
    name: "Task 1"
}
console.log(item1.id)
const item2 = {
    id: v4(),
    name: "Task 2"
}

const App = () => {
    const [text, setText] = useState("")

    // In this State we are Creating the Containers in which the List Items are Present like Pending Container, Working and Done 
    const [state, setState] = useState({
        "pending": {
            title: "Pending",
            items: [item1, item2]
        },
        "working": {
            title: "Working",
            items: []
        },
        "done": {
            title: "Done",
            items: []
        }
    })

    const DragEnd = ({ source, destination }) => {
        if (!destination) {
            return
        }

        if (source.index === destination.index && source.droppableId === destination.draggableId) {
            return
        }

        //Copying our item before removing it from state
        const itemCopy = { ...state[source.droppableId].items[source.index] }

        setState(prev => {
            prev = { ...prev }
            prev[source.droppableId].items.splice(source.index, 1)
            prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

            return prev
        })
    }

    const addItem = () => {
        setState(prev => {
            return {
                // Using Spread here For the Previous Tasks for keeping the data available 
                ...prev,
                pending: {
                    title: "Pending",
                    items: [
                        {
                            id: v4(),
                            name: text
                        },
                        // Using Spread here for the Current Tasks and spreading them into a new Array 
                        ...prev.pending.items
                    ]
                }
            }
        })

        setText("");
    }

    return (
        <div className="App">
            <div>
                <input className="form-control mt-5 px-3" type="text" placeholder="Enter Task" value={text} onChange={(e) => setText(e.target.value)} />
                <button className='btn btn-success text-light mx-4 mt-3 ' onClick={addItem}>Add Task</button>
            </div>
            <DragDropContext onDragEnd={DragEnd}>
                {_.map(state, (data, key) => {
                    return (
                        <div key={key} className={"column"}>
                            <h3 className='text-center mt-2'>{data.title}</h3>
                            <Droppable droppableId={key}>
                                {(provided, snapshot) => {
                                    return (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={"droppable-col"}
                                        >
                                            {data.items.map((element, index) => {
                                                return (
                                                    <Draggable key={element.id} index={index} draggableId={element.id}>
                                                        {(provided, snapshot) => {
                                                            console.log(snapshot)
                                                            return (
                                                                <div
                                                                    className={`item ${snapshot.isDragging && "dragging"}`}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    {element.name}
                                                                </div>
                                                            )
                                                        }}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )
                                }}
                            </Droppable>
                        </div>
                    )
                })}
            </DragDropContext>
        </div>
    );
}

export default App;


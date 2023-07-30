import React, { useEffect, useRef, useState } from 'react'
import { useDataStore } from './dataStore'
import {
    Menu,
    Item,
    Separator,
    Submenu,
    useContextMenu
  } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
const menu_id = "message";
const editMenuId = "edit"
export default function Messages() {

    const [notes, setNotes]  = useState(null)
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState('')
    const [renderNothing, setrenderNothing] = useState(false)
    const doRefetchNotes = useDataStore(state => state.doRefetchNotes)
    const refetchNotes = useDataStore(state => state.refetchNotes)
    const [rightClickedBlock, setrightClickedBlock] = useState("")
    const [editMode, setEditMode] = useState(false)
    const [selection, setSelection] = useState('');
    const [message, setMessage] = useState('');
    const screenType = useDataStore(state => state.screenType)
    const [returnNull, setReturnNull] = useState(false)
    const [messageWidth, setMessageWidth] = useState('400px')
    const [messageHeight, setMessageHeight] = useState('650px')

    useEffect(() => {
        const token = localStorage.getItem("token")
        fetch("http://localhost:5000/getnotes", {
            method: "GET",
            headers:{
                "x-access-token": token,
            },
        })
        .then((res) => res.json())
        .then(res => {
            setNotes(res)
            if(res.status == 'no-book'){
                setReturnNull(true)
            }else {
                setReturnNull(false)
            }
            console.log(res)
        })
        setLoading(false)
    },[refetchNotes])
    useEffect(() => {
        const height = window.innerHeight
        const diff = height  - 216

        console.log(messageHeight)
        console.log("-----------")
        if(screenType == 'phone'){
            setMessageWidth('100vw')
            setMessageHeight((diff - 20).toString() +'px')
  
        }else {
            setMessageWidth('400px')

        }
    }, [screenType])
    const handleChange = (event) => {
        setContent(event.target.innerText)
    
        console.log(event.target.innerText)
    }
    const handlePaste = (event) => {
        event.preventDefault();
    
        const plainText = event.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, plainText);
      };
    const { show } = useContextMenu()

    // function handleItemClick({ event, props, triggerEvent, data}){
    //     console.log(event, props, triggerEvent, data);
    // }


    const deleteNote = (id) => {
        console.log(id)
        const token = localStorage.getItem("token")
        setNotes(notes.filter(note => note.block_id != id))
        let body : {block_id: string, type: string} = {block_id: id, type:"note"}
        fetch("http://localhost:5000/deleteblock", {
            method: "DELETE",
            headers: {
                "x-access-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((res) => res.json()).then((res) => console.log(res.status))
    }

    const handleContextMenu = (id, e) => {
        setrightClickedBlock(id)
        console.log(e)
        show({
            id: menu_id,
            event: e,
        })
    }

    function handleSelection(e) {
        const selection = window.getSelection().toString();
        setSelection(selection);
        console.log(selection);
        show({
            id: editMenuId,
            event:e,
        })
      }

    const handleMessageChange = (event) => {
        setMessage(event.target.innerText)
    }

    const handleMessageUpdate = (event ,id) => {
        // console.log(event.target.innerHTML)
        
        const token = localStorage.getItem("token")
        let body : {content: string, id: string} = {content: event.target.innerHTML, id: id}
            fetch("http://localhost:5000/getnotes", {
            method: "PUT",
            headers: {
                "x-access-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((res) => res.json())
        .then((resp) => {
            // setNotes(resp)
        })        
    }

    const addNote = () => {
        const token = localStorage.getItem("token")
        // const new_note = {
        //     block_id: "sample",
        //     content: content,
        //     id:  "sample",
        //     note_type:  "note",
        //     object: "note"
        // }
        // notes.push(new_note)
        let body : {content: string} = {content: ''}
        fetch("http://localhost:5000/getnotes", {
            method: "POST",
            headers: {
                "x-access-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((res) => res.json())
        .then((resp) => {
            setNotes(resp)
        })
        setContent('')
        console.log("notes")
        console.log(notes)
    }
    if (loading) return(<h1>Wait....</h1>)
    if(returnNull) return(<></>)
    // if(renderNothing) return(<>fuck</>)
if (!loading) {
    return (
        <div style={{width:messageWidth, height:messageHeight}} className='flex flex-col bg-transparent overflow-y-auto pl-4 pr-4  items-end'>
            {notes == null
                ?
                <div className=' mt-56 w-96'>
                    <h1>Nothing to see here</h1>            
                </div>
                :<div className=' '  style={{}}>
                {notes.map((note) => (
                    <>
                        <div  onContextMenu={(e) => handleContextMenu(note.block_id, e)} style={{background:'rgba(255, 255, 255, 0.56)', lineHeight:"normal" ,  fontSize:"16px", fontWeight:"400",backdropFilter:"blur(15px)", padding:"12px", maxWidth:"fit-content", borderRadius:"15px"}} key={note.block_id} className='mt-2 ml-auto  bg-gray-100'>
                        
                           {/* <p>{note.content}</p>  */}
                           {/* <input 
                                         autoFocus
                                         style={{fontSize:"16px"}}
                                         type='text'
                                         value={note.content}
                                         onChange={handleChange}
                           /> */}
                           {/* <div class="notranslate" spellcheck="true" placeholder="Press ‘space’ for AI, ‘/’ for commands…" data-content-editable-leaf="true" contenteditable="true" style="max-width: 100%; width: 100%; white-space: pre-wrap; word-break: break-word; caret-color: rgba(255, 255, 255, 0.81); padding: 3px 2px; text-align: left;">But I am still very bullish on the whole idea of AI generating it’s own book covers. AI animated videos are very much more engaging. I believe that it can capture the very essence of a book, it can even fucking analyze the contents of the fucking book and generate the best book cover you will ever fucking find <img class="notion-emoji" alt="😂" aria-label="😂" style="width:1em;height:1em;background-repeat:no-repeat;background:url(&quot;/images/emoji/twitter-emoji-spritesheet-64.d3a69865.png&quot;);background-position-x:54.23728813559322%;background-position-y:91.52542372881356%;background-size:6000% 6000%;vertical-align:-0.1em;margin:0 0.1em" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="><img class="notion-emoji" alt="😂" aria-label="😂" style="width:1em;height:1em;background-repeat:no-repeat;background:url(&quot;/images/emoji/twitter-emoji-spritesheet-64.d3a69865.png&quot;);background-position-x:54.23728813559322%;background-position-y:91.52542372881356%;background-size:6000% 6000%;vertical-align:-0.1em;margin:0 0.1em" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">​</div> */}
                           <div  onPaste={handlePaste} className='outline-none  cursor-text font-normal' style={{width:"fit-content"}}  placeholder='Write a note...' autoFocus  onInput={(e) => handleMessageUpdate(e,note.id)} contentEditable="true" dangerouslySetInnerHTML={{ __html: note.content}}/>
                            
                           
                           {/* <textarea
                                rows={0}
                                cols={50}
                                className=' outline-none border-none bg-transparent' 
                                value={note.content}
                                style={{width: "fit-content", maxHeight:"auto"}}></textarea> */}
                            {/* <button style={{}} onClick={() => deleteNote(note.block_id)} className='text-red-600 '>x</button> */}

                        </div>
                       
                    </>
                ))

                }

                </div>
            }
                <button className='mt-3 ' style={{background:'rgba(255, 255, 255, 0.3)', lineHeight:"normal" ,  fontSize:"13px", fontWeight:"400",backdropFilter:"blur(7px)", padding:"10px", borderRadius:"100px"}} onClick={addNote}>New Note</button>

          {/* <div className='mt-4 max-w-3xl p-3 rounded-lg bg-gray-100'>
            Happiness is a state of well-being and contentment. It is a feeling of joy, satisfaction, and fulfillment. Happiness is not something that happens to us; it is something that we create for ourselves. There are many things that we can do to increase our happiness, including spending time with loved ones, doing things that we enjoy, helping others, being grateful, and taking care of ourselves. Happiness is not a destination; it is a journey. There will be ups and downs along the way, but if we focus on the positive and make an effort to live a happy life, we will find that happiness is within our reach.
          </div>
          <div className='mt-2 max-w-3xl p-3 rounded-lg bg-gray-100'>
            The Meaning of life is to find something that you would...        
          </div> */}
                            <Menu  id={menu_id} theme='dark'>
                                <Item onClick={() => deleteNote(rightClickedBlock)}>
                                    Delete
                                </Item>
                            </Menu>
                            <Menu  id={editMenuId} theme='dark'>
                                <Item >
                                    Lets edit this shit
                                </Item>
                            </Menu>
          {/* <div className='fixed bottom-5 left-0 right-0   rounded-t-md flex items-center justify-center' style={{position:"fixed", marginTop:"auto"}}>
            <input style={{background:'rgba(255, 255, 255, 0.56)',backdropFilter:"blur(17px)", width:"450px"}}  value={content} onChange={handleChange} className='rounded-3xl p-4 ml-2  w-full  outline-none placeholder-gray-900' placeholder='Write a note...'/> 
            <div  className='rounded-3xl p-4 ml-2  w-full  outline-none placeholder-gray-900' onInput={(e) => handleMessageChange(e)}  style={{background:'rgba(255, 255, 255, 0.56)',backdropFilter:"blur(17px)", direction:'ltr',width:"450px", whiteSpace:'pre-wrap', wordBreak: "break-word",textAlign:'left'}}  contentEditable={true}>{content}</div>
            <button onClick={addNote}>YES!</button>
          </div> */}
        </div>
  )
        }
}

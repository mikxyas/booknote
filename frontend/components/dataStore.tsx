import {create} from 'zustand'
import {User, HeaderStructure,State} from './types'
import { useEffect, useState } from 'react'

function someFunction(block:object)  {
        // Make a function that is able to handle mutliple objects being in a list make 0 into an i that looks at the length of the object
        const res = {}
        const shelf = {
           books: {}
        }
        const chapter = {}
        const notes = {}
    
        console.log(Object.keys(block).length) 
        for(let i=Object.keys(block).length; i--; i >= 0){
          const lib_id = Object.keys(block)[i]
          console.log(block[lib_id]["object"])
    
          if(block[lib_id]["object"] != "library"){
            if(block[lib_id].type == "shelf"){
              shelf[block[lib_id].id] = block[lib_id]["shelf"]
              console.log(shelf)
            }
            // use zustand to fix this
            if(block[lib_id].type == "book"){
              shelf["books"][block[lib_id].parent_id] = block[lib_id]["book"]
            }
          }
    
          console.log(block[lib_id])
          if(block[lib_id].child != undefined){
            someFunction(block[lib_id].child)
          }
          res[block[lib_id]] = shelf
        }
        
        console.log("--------------")
        console.log(res)
    return {shelf}
}

export const useDataStore = create<State>(set => ({
    user:{
        name: 'John Doe',
        email: 'johndoe@example.com',
        id: '12345',
        active_book: '1'
    },
    blocks:{},
    token: '',
    active_book:'',
    shelfs:{},
    loggedIn: false,
    headerFetched: false,
    collapseNavbar:false,
    reFetchPage: false,
    showShelf: false,
    setShowShelf: () => set((state) => ({showShelf: !state.showShelf})),
  
    refetchHeader: false,
    doRefetchHeader: () => set((state) => ({refetchHeader: !state.refetchHeader})),

    refetchShelf: false,
    doRefetchShelf: () => set((state) => ({refetchShelf: !state.refetchShelf})),

    refetchNotes: false,
    doRefetchNotes: () => set((state) => ({refetchNotes: !state.refetchNotes})),

    doRefetchAll: () => set((state) => ({refetchNotes: !state.refetchNotes, refetchShelf: !state.refetchShelf, refetchHeader: !state.refetchHeader})),

    screenType: 'laptop',
    setScreenType: (screenType) => set((state) => ({screenType: screenType})),

    bg: './flower.webp',
    setBg: (link) => set((state) => ({bg:link})),

    setReFetchPage: () => set((state) => ({reFetchPage: !state.reFetchPage})),
    setCollapseNavbar:() => set((state) => ({collapseNavbar: !state.collapseNavbar})),
    setLogged: (isLoggedIn) => set((state) => ({loggedIn:isLoggedIn})),
    updateToken: () => set((state) => ({token: localStorage.getItem('token')})),
    setToken: (token) => {set((state) => ({token: token, loggedIn: true})), localStorage.setItem('token', token)},
    removeToken: () => {set((state) => ({token: '', loggedIn:false})), localStorage.removeItem('token')},
    setUser: (user: User) => set((state) => ({user: user})),
    setBlocks: (blocks) => set((state) => ({ blocks: blocks})),
    setShelf: (shelves) => set((state) => ({shelfs:shelves})),
    addShelf: (shelf) => set((state) => ({shelfs: state.shelfs + shelf })),
    deleteShelf: (id) => set((state) => ({shelfs: state.shelfs.filter(shelf => shelf.id != id)})),

}))


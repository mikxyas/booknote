export type User = {
    active_book: string, 
    email: string, 
    id: string, 
    name:string
}

export type HeaderStructure = {
    chapter?: string,
    chapter_list?: any,
    cover?: string,
    status?: string,
    title?: string
}

export interface State {
    user: User;
    blocks: object | Blocks;
    token: string;
    active_book: string;
    shelfs: any;
    loggedIn: boolean;
    reFetchPage: boolean;
    setReFetchPage(): void;
    setBlocks(block:object): void;
    setUser(block:object): void;
    setLogged(logged:boolean): void;
    collapseNavbar: boolean;
    setShelf(shelves:object): void;
    addShelf(shelf:object): void,
    deleteShelf(id: string): void,
    refetchHeader: boolean,
    doRefetchHeader():void,
    refetchNotes: boolean,
    doRefetchNotes(): void,
    refetchShelf: boolean,
    doRefetchShelf():void,
    doRefetchAll():void,
    headerFetched: boolean,
    showShelf:boolean,
    removeToken():void;
    setShowShelf(): void,
    screenType: string,
    setScreenType(screenType: string): void,
}
interface Content {

}

interface Book {

}
interface Shelf {

}
interface Chapter {

}
interface Blocks {
    content: Content;
    id: string;
    lib_id: string;
    object: string;
    parent_id: string | null;
    shelf: Shelf;
    
  }
  

export type Props = {
    user: object, 
    blocks: object, 
    success: boolean
}


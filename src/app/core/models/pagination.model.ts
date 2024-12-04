export interface Pagination<T>{
    data:T[];
    page:number;
    pages:number;
    pageSize:number;
}
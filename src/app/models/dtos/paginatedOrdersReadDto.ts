import { Order } from "../order";

export class PaginatedOrdersReadDto {
    items: Order[] = [];
    totalCount: number = 0;
    pageNumber: number = 1;
    pageSize: number = 5;
    totalPages: number = 0;
    hasPreviousPage: boolean = false;
    hasNextPage: boolean = false;
}
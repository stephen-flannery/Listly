export interface TodoType {
    id: string;
    created_at: string;
    updated_at: string;
    author: string;
    text: string;
    isCompleted: boolean;
    isDeleted?: boolean;
}

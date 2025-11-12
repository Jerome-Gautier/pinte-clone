export type ImageModel = {
    id: number;
    url: string;
    title: string;
    user_id: number;
    username: string;
    is_favorite: boolean;
    favorite_count: number;
    isBroken: boolean | null;
}
export interface IResult {
    _id: string;
    created_at: string;
    explanation: string;
    image: {
        public_id: string;
        resource_type: string;
        url: string;
    };
    user_id: string;
}
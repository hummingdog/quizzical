import { useQuery, gql } from '@apollo/client';

const GET_QUESTIONS = gql`
    query getQuestions {
    questions {
        id,
        questionText,
        selection
    }
}`

export default function GetQuestions() {
    const { loading, error, data } = useQuery(GET_QUESTIONS);

    if (loading) return loading;
    if (error) return error;

    return data
}
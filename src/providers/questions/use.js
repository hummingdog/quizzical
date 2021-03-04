import { useContext } from 'react';
import QuestionsContext from './context';

export default function useQuestions() {
    return useContext(QuestionsContext);
}
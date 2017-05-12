import React from 'react';
import QuestionsList from './QuestionsList.jsx';

const RecentQuestions = props => (
  <section className="recentQuestions">
    <h1 className="headline">Recent Questions</h1>
    <input placeholder="search" value={props.searchVal} onChange={props.changeSearch} />
    <QuestionsList 
      answerQuestion={props.answerQuestion}
      questions={props.questions} 
      changeIndexProp={props.changeIndexProp} 
    />
  </section>
);


export default RecentQuestions;
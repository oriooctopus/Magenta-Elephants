import React from 'react';
import AnswerQuestion from './AnswerQuestion.jsx';
import AskedQuestion from './AskedQuestion.jsx';

class Answer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // id: Number(this.props.match.params.number),
      question: {}
    }
  }

  render () {
    return (
      <section className="main">
        <div className="giveAnswer">
          <AskedQuestion question={this.state.question}/>
        </div>
        <div className="giveAnswer">
          <AnswerQuestion /> 
        </div>  
      </section>
    )
  }
}

export default Answer;
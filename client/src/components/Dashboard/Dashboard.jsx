import React from 'react';
import { Link } from 'react-router-dom';
import RecentQuestionsList from './RecentQuestionsList.jsx';
import Rating from './Rating.jsx';
import Currency from '../Currency.jsx';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.props.userInfo.recentNoviceQuestions = this.props.userInfo.recentNoviceQuestions || [];
    this.props.userInfo.recentExpertQuestions = this.props.userInfo.recentExpertQuestinos || [];

    return (
      <section className="dashboard">

        <div className="row">
          <img src={this.props.userInfo.avatar_url} className="profilePicture" />
          <div className="bio">
            <h1>{this.props.userInfo.username}</h1>
            <p>{this.props.userInfo.bio}</p>
          </div>
        </div>

        <div className="row">
          <div className="askedQuestions">
            <h1>Asked Questions</h1>
            <RecentQuestionsList 
              questions={this.props.userInfo.recentNoviceQuestions} 
              changeIndexProp={this.props.changeIndexProp}
            />         
          </div>
          <div className="questionRatings">
            <Rating name="Novice" value={this.props.userInfo.noviceRating} />
            <hr />
            <Rating name="Expert" value={this.props.userInfo.expertRating} />
          </div> 
        </div>

        <div className="row">
          <div className="userPoints">
            <Currency name="Current" currency={this.props.userInfo.currentCurrency} />
            <Currency name="Total" currency={this.props.userInfo.totalCurrency} />
          </div>
          <div className="answerQuestions">
            <h1>Answered Questions</h1>
            <RecentQuestionsList 
              questions={this.props.userInfo.recentExpertQuestions} 
              changeIndexProp={this.props.changeIndexProp}
            />
          </div>
        </div>

      </section>
    )
  }
}

export default Dashboard;
import React from 'react';
import RecentQuestions from './RecentQuestions.jsx';
import AskedQuestion from './AskedQuestion.jsx';
import { Switch, Route } from 'react-router-dom';
import Ask from './Ask.jsx';
import Answer from './Answer.jsx';
import $ from 'jquery';
import Dashboard from './Dashboard/Dashboard.jsx';

class SplitLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      recentlyAsked: [],
      searchVal: ''
    };
    this.answerQuestion = this.answerQuestion.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.searchTags = this.searchTags.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

  componentWillMount() {
    this.getQuestions();
    this.getQuestionsInterval = setInterval(this.getQuestions, 5000);
  }

  getQuestions() {
    $.get('/questions', (req, res) => {})
      .then(results => {
        this.setState({ questions: results });
      })
      .catch(err => {
        console.log('there was an error with get ', err)
      });
  }

  searchTags() {
    this.setState({ recentlyAsked: this.state.questions });

    var query = '/questions/' + this.state.searchVal;
    console.log('the query', query);
    $.get(query, (req, res) => {})
      .then(results => {
        this.setState({ questions: JSON.parse(results) });
      })
      .catch(err => {
        console.log('there was an error with searchtags', err);
      })
  }

  changeSearch(e) {
    clearTimeout(this.getQuestionsInterval);
    if (this.searchCountdown) {
      clearTimeout(this.searchCountdown);
    } 
    this.searchCountdown = setTimeout(() => this.searchTags(), 1500);

    this.setState({
      searchVal: e.target.value
    });
  }

  answerQuestion(index) {
    clearInterval(this.getQuestionsInterval);
    this.props.changeIndexProp('currentQuestion', this.state.questions[index]);
  }

  render() {
    return (
      <div className="main">
        <RecentQuestions 
          answerQuestion={this.answerQuestion}
          changeSearch={this.changeSearch}
          questions={this.state.questions}
        />
        <Switch>
          <Route exact path="/Ask" render={innerProps => (
            <Ask 
              changeUserCurrency={this.props.changeUserCurrency}
              changeIndexProp={this.props.changeIndexProp}
              personalInfo={this.props.personalInfo}
              username={this.props.username}
              questions={this.state.questions}
              redirect={this.props.redirect}
            />
          )} />
          <Route exact path="/Dashboard" render={innerProps => (
            <Dashboard 
              userInfo={this.props.personalInfo}
              changeIndexProp={this.props.changeIndexProp}
            /> 
          )} />
          <Route exact path="/Asked/Recent" render={innerProps => (
            <AskedQuestion question={this.props.currentQuestion} />
          )} />
          <Route path="/Asked/:number" render={innerProps => (
            <AskedQuestion question={this.state.questions[innerProps.match.params.number]} />
          )} />
        </Switch>
      </div>
    )
  }
};


export default SplitLayout;
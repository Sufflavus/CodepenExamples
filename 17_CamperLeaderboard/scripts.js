var TableHeader = React.createClass({
  getInitialState: function() {
    return { 
      showRecentArrow: true,
      showAllArrow: false
    };
  },
  handleRecentClick: function() {
    this.setState({ 
      showRecentArrow: true,
      showAllArrow: false
    });
    this.props.onRecentClick();
  },
  handleAllClick: function() {
    this.setState({ 
      showRecentArrow: false,
      showAllArrow: true
    });
    this.props.onAllClick();
  },
  render: function() {
    return (
      <tr>
        <th>#</th>
        <th>Camper Name</th>
        <th className="center-align">
          <span onClick={this.handleRecentClick}>
            Points in past 30 days
            { this.state.showRecentArrow ? <span>&#9660;</span> : null }
          </span>
        </th>
        <th className="center-align">
          <span onClick={this.handleAllClick}>
            All time points 
            { this.state.showAllArrow ? <span>&#9660;</span> : null }
          </span>
        </th>
      </tr>
    );
  }
});

var TableRow = React.createClass({
  render: function() {  
    return (
      <tr>
        <td>{this.props.index}</td>
        <td>
          <a href={this.props.user.url} target="_blank">
            <img className="circle" src={this.props.user.img}/>
            <span>{this.props.user.username}</span>            
          </a>          
        </td>
        <td className="center-align">{this.props.user.recent}</td>
        <td className="center-align">{this.props.user.alltime}</td>
      </tr>
    );
  }
});

var CampersTable = React.createClass({
  loadUsers: function(url) {
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.initRows(data);
      }.bind(this)
    });
  },
  loadTopRecentUsers: function() {
    this.loadUsers("//fcctop100.herokuapp.com/api/fccusers/top/recent");    
  },
  loadTopAllTimeUsers: function() {
    this.loadUsers("//fcctop100.herokuapp.com/api/fccusers/top/alltime");      
  },
  getInitialState: function() {
    return {rows: []};
  },
  componentDidMount: function() {
    this.loadTopRecentUsers();    
  },  
  handleRecentClick: function(comment) {
    this.loadTopRecentUsers();    
  },
  handleAllClick: function(comment) {    
    this.loadTopAllTimeUsers();    
  },
  initRows: function(users) {
    var rows = users.map(function(user, index) {
      user.url = "https://www.freecodecamp.com/" + user.username;
      return (
        <TableRow index={index+1} user={user} key={user.username}/>         
      );
    });
    this.setState({rows: rows});
  },
  render: function() {
    return (
      <table className="striped bordered">
        <thead>
          <TableHeader 
            onRecentClick={this.handleRecentClick} 
            onAllClick={this.handleAllClick}>
          </TableHeader>
        </thead>
        <tbody>
          {this.state.rows}
        </tbody>
      </table>
    );
  }
});

ReactDOM.render(
  <CampersTable />,
  document.getElementById('container')
);
var MarkdownPreviewer = React.createClass({  
  getInitialState: function() {
    return { 
      text: "# Hello, This is Markdown Preview\n\n----\n## What is Markdown?\n see [Wikipedia](http://en.wikipedia.org/wiki/Markdown)\n\n> Markdown is a lightweight markup language, originally created by John Gruber and Aaron Swartz allowing people \"to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML)\".\n\n----\n## Usage\n1. Write markdown text in this textarea.\n2. Enjoy.\n\n----\n## markdown quick reference\n# headers\n\n*emphasis*\n\n**strong**\n\n`monospace`\n\n~~strikethrough~~\n\n* list\n\n>block quote\n\n    code (4 spaces indent)\n[links](http://wikipedia.org)\n\n----\n## changelog\n* 20-Mar-2016 initial commit\n\n----\n## thanks\n* [marked](https://github.com/chjj/marked)"
    };
  },
  
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  
  rawMarkup: function() {
    var rawMarkup = marked(this.state.text, {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-md-6">
          <textarea 
            value={this.state.text} 
            onChange={this.handleTextChange}>
          </textarea>       
        </div>
        <div dangerouslySetInnerHTML={this.rawMarkup()} className="col-md-6">
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <MarkdownPreviewer/>,
  document.getElementById('container')
);
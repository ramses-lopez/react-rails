// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Hello = props => (
  <div>Hello {props.name}!</div>
)

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

class PostList extends React.Component {
  constructor(props){
    super(props)
    this.state = { posts: [],
      token: null
    }
  }

  componentDidMount(){
    this.setState({token: document.querySelector('meta[name=csrf-token]').content })
    this.getPosts()
  }

  getPosts = () => {
    const rq = new Request('http://localhost:3000/posts.json', {mode: 'cors'})

    fetch(rq)
    .then(response => {
      if(response.ok){
        response.json()
        .then(posts => {
          this.setState({posts: posts})
        })
      }
      else {
        console.log('Not OK',response);
      }
    })
    .catch(e => {
      console.error(e)
    })
  }

  createPost = () => {
    const rq = new Request('http://localhost:3000/posts.json', {
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({authenticity_token: this.state.token, post: {content: 'koopa'}})
    })

    fetch(rq)
    .then(rp => {
      console.log(rq)
      this.getPosts()
    })
    .catch(e => {
      console.error(e)
    })
  }

  render(){
    const posts = this.state.posts.map((p, idx)=> <li key={idx}> [{p.id}] - {p.content}</li>)
    return (
      <ul>
        {posts}
        <li><button onClick={this.createPost}>New post</button></li>
      </ul> )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <div>
      <Hello name="Virgy" />
      <PostList />
    </div>
    ,
    document.body.appendChild(document.createElement('div')),
  )
})

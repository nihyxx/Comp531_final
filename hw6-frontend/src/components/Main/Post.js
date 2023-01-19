import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export class Post extends Component {
    render() {
        return (
            <div>
                <Card>
                    <Card.Body>
                        <Card>
                            <Card.Img variant="top" src="https://picsum.photos/id/1/800/400" />
                            <Card.Text>
                                {this.props.postText}
                            </Card.Text>

                        </Card>
                        <div>
                            <Button variant="primary">Edit</Button>
                            <Button variant="primary">Comment</Button>
                        </div>
                    </Card.Body>


                </Card>

            </div>
        )
    }
}

export default Post

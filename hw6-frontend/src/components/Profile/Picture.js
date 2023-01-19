import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'


export default function Picture() {
    return (
        <div>
            <div className="mt-5 ml-5">
                <img src="https://picsum.photos/500/300"/>
            </div>
            <div className="mt-3">
                <input className="px-5" type="file" />
            </div>
        </div>
    )
}

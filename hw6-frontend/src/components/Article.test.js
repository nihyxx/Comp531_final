import React from 'react';
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Main from './Main/Main'

Enzyme.configure({ adapter: new Adapter() })

describe('Validate Article', () => {
    it('should fetch articles for current logged in user', async () => {
        let wrapper = shallow(<Main />)
        const instance = wrapper.instance()
        wrapper.state().userId = 1
        await instance.fetchUsers()
        await instance.getUserName()
        await instance.fetchPosts()
        await instance.getUserPosts()
        expect(wrapper.state().userPosts.length).toBe(10)
    })

    it('should filter displayed articles by search keyword', async () => {
        let wrapper = shallow(<Main />)
        const instance = wrapper.instance()
        wrapper.state().userId = 1
        await instance.fetchUsers()
        await instance.getUserName()
        await instance.fetchPosts()
        await instance.getUserPosts()

        wrapper.state().searchPost = "quia et"
        await instance.filterPost()
        expect(wrapper.state().filteredPosts.length).toBe(1)


    })

    it('should add articles when adding a follower', async () => {
        let wrapper = shallow(<Main />)
        const instance = wrapper.instance()
        wrapper.state().userId = 1
        await instance.fetchUsers()
        await instance.getUserName()
        await instance.fetchPosts()
        await instance.getUserPosts()

        wrapper.state().newFriendName = "Antonette"
        await instance.addFriend()
        expect(wrapper.state().filteredPosts.length).toBe(20)
    })

    it('should remove articles when removing a follower', async () => {
        let wrapper = shallow(<Main />)
        const instance = wrapper.instance()
        wrapper.state().userId = 1
        await instance.fetchUsers()
        await instance.getUserName()
        await instance.fetchPosts()
        wrapper.state().newFriendName = "Antonette"
        await instance.addFriend()
        expect(wrapper.state().filteredPosts.length).toBe(20)
        await instance.removeFriend(2)
        expect(wrapper.state().filteredPosts.length).toBe(10)
        instance.addPost()
    })
})
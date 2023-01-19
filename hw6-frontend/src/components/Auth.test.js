import React from 'react';
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Login from './Landing/Login'
import User from './Main/User'

Enzyme.configure({ adapter: new Adapter() })

describe('Validate Authentication', () => {

    it('should log in previously registered user', async () => {
        let wrapper = shallow(<Login />)
        const instance = wrapper.instance()
        await instance.fetchItems()
        const data = wrapper.state().data

        data.map(each => {
            wrapper.find('input[name="userName"]').simulate('change', { target: { name: 'userName', value: each.username } })
            wrapper.find('input[name="password"]').simulate('change', { target: { name: 'password', value: each.address.street } })
            wrapper.find('button').simulate('click')
            expect(wrapper.state().redirectMain).toBe(true)
        })
    })

    it('should not log in an invalid user', async () => {
        window.alert = () => {}
        let wrapper = shallow(<Login />)
        const instance = wrapper.instance()
        await instance.fetchItems()
        wrapper.find('input[name="userName"]').simulate('change', { target: { name: 'userName', value: "an invalid user" } })
        wrapper.find('input[name="password"]').simulate('change', { target: { name: 'password', value: "some password" } })
        wrapper.find('button').simulate('click')
        expect(wrapper.state().redirectMain).toBe(false)
    })

    it('should log out a user', async () => {
        let wrapper2 = shallow(<Login />)
        const instance2 = wrapper2.instance()
        await instance2.fetchItems()
        wrapper2.find('input[name="userName"]').simulate('change', { target: { name: 'userName', value: 'Bret' } })
        wrapper2.find('input[name="password"]').simulate('change', { target: { name: 'password', value: 'Kulas Light' } })
        wrapper2.find('button').simulate('click')

        let wrapper = shallow(<User />)
        const instance = wrapper.instance()
        wrapper.find('button').at(0).simulate('click')
        expect(localStorage.getItem("userId")).toBe("")
        expect(localStorage.getItem("userValid")).toBe("")
    })


})


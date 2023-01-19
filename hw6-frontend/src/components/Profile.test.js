import React from 'react';
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Update from './Profile/Update'

Enzyme.configure({ adapter: new Adapter() })

describe('Validate Profile', () => {
    it('should fetch the logged in users profile information', async () => {
        let wrapper = shallow(<Update />)
        const instance = wrapper.instance()
        wrapper.state().userId = 1
        await instance.fetchUsers()
        await instance.submitHandler()

        expect(wrapper.state().validUserName).toBe("Bret")
    })
})
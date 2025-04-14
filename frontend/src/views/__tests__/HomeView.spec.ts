import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

vi.mock('@/components/organism/KivaLoanGrid.vue', () => ({
  default: {
    name: 'KivaLoanGrid',
    template: '<div class="mocked-kiva-loan-grid"></div>'
  }
}))

describe('HomeView', () => {
  it('renders properly with KivaLoanGrid component', () => {
    const wrapper = mount(HomeView)
    
    expect(wrapper.find('main').exists()).toBe(true)
    
    expect(wrapper.findComponent({ name: 'KivaLoanGrid' }).exists()).toBe(true)
  })
  
  it('passes proper structure to the DOM', () => {
    const wrapper = mount(HomeView)
    
    const main = wrapper.find('main')
    expect(main.element.children.length).toBe(1)
    expect(wrapper.findAll('.mocked-kiva-loan-grid').length).toBe(1)
  })
}) 

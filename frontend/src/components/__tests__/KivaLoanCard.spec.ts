import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KivaLoanCard from '../molecule/KivaLoanCard.vue'

describe('KivaLoanCard', () => {
  it('renders properly with required props', () => {
    const wrapper = mount(KivaLoanCard, {
      props: {
        id: 1,
        name: 'John Doe',
        loanAmount: 1000,
        fundedAmount: 500,
        imageUrl: 'https://example.com/image.jpg',
        whySpecial: 'Special reason',
        location: 'Kenya',
        categories: []
      }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Kenya')
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/image.jpg')
  })

  it('calculates funding percentage correctly', () => {
    const wrapper = mount(KivaLoanCard, {
      props: {
        id: 1,
        name: 'John Doe',
        loanAmount: 1000,
        fundedAmount: 500,
        imageUrl: 'https://example.com/image.jpg',
        whySpecial: 'Special reason',
        location: 'Kenya',
        categories: []
      }
    })

    const progressBar = wrapper.find('.progress-bar')
    expect(progressBar.attributes('style')).toBe('width: 50%;')

    expect(wrapper.text()).toContain('$500 to go')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(KivaLoanCard, {
      props: {
        id: 1,
        name: 'John Doe',
        loanAmount: 1000,
        fundedAmount: 500,
        imageUrl: 'https://example.com/image.jpg',
        whySpecial: 'Special reason',
        location: 'Kenya',
        categories: []
      }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
}) 

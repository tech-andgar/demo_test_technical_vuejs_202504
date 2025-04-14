import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import KivaLoanGrid from '../organism/KivaLoanGrid.vue'
import { useLoan } from '@/composables/useLoan'
import { ref } from 'vue'

vi.mock('@/composables/useLoan', () => ({
  useLoan: vi.fn()
}))

describe('KivaLoanGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays loading spinner when loading', () => {

    const loadLoansMock = vi.fn()
    vi.mocked(useLoan).mockReturnValue({
      loans: ref([]),
      loadLoans: loadLoansMock,
      loadingLoans: ref(true)
    })

    const wrapper = mount(KivaLoanGrid)
    
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(loadLoansMock).toHaveBeenCalled()
  })

  it('displays no loans message when no loans are available', () => {

    const loadLoansMock = vi.fn()
    vi.mocked(useLoan).mockReturnValue({
      loans: ref([]),
      loadLoans: loadLoansMock,
      loadingLoans: ref(false)
    })

    const wrapper = mount(KivaLoanGrid)
    
    expect(wrapper.find('.no-loans-text').exists()).toBe(true)
    expect(wrapper.text()).toContain('No loans found')
    expect(loadLoansMock).toHaveBeenCalled()
  })

  it('renders loan cards when loans are available', async () => {

    const mockLoans = [
      {
        id: 1,
        name: 'John Doe',
        loanAmount: 1000,
        loanFundraisingInfo: { fundedAmount: 500 },
        image: { url: 'https://example.com/image1.jpg' },
        whySpecial: 'Special reason 1',
        geocode: { country: { name: 'Kenya' } },
        themes: []
      },
      {
        id: 2,
        name: 'Jane Smith',
        loanAmount: 800,
        loanFundraisingInfo: { fundedAmount: 400 },
        image: { url: 'https://example.com/image2.jpg' },
        whySpecial: 'Special reason 2',
        geocode: { country: { name: 'Tanzania' } },
        themes: []
      }
    ]

    const loadLoansMock = vi.fn()
    vi.mocked(useLoan).mockReturnValue({
      loans: ref(mockLoans),
      loadLoans: loadLoansMock,
      loadingLoans: ref(false)
    })

    const wrapper = mount(KivaLoanGrid)
    await flushPromises()
    
    expect(wrapper.findAll('.kiva-style-grid-item').length).toBe(2)
    expect(loadLoansMock).toHaveBeenCalled()
  })

  it('calls handleLoanClick when a loan card is clicked', async () => {

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    

    const mockLoans = [
      {
        id: 1,
        name: 'John Doe',
        loanAmount: 1000,
        loanFundraisingInfo: { fundedAmount: 500 },
        image: { url: 'https://example.com/image1.jpg' },
        whySpecial: 'Special reason 1',
        geocode: { country: { name: 'Kenya' } },
        themes: []
      }
    ]

    const loadLoansMock = vi.fn()
    vi.mocked(useLoan).mockReturnValue({
      loans: ref(mockLoans),
      loadLoans: loadLoansMock,
      loadingLoans: ref(false)
    })

    const wrapper = mount(KivaLoanGrid)
    await flushPromises()
    

    const loanCard = wrapper.findComponent({ name: 'KivaLoanCard' })
    await loanCard.vm.$emit('click')
    
    expect(alertSpy).toHaveBeenCalledWith('Loan 1 clicked')
    alertSpy.mockRestore()
  })
}) 

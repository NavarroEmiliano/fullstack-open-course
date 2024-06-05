import { render, fireEvent } from '@testing-library/react'
import Note from './Note'
import { vitest } from 'vitest'

describe('App', () => {
  it('renders the App component', () => {
    const note = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }

    const component = render(<Note note={note} />)
    expect(component.container).toHaveTextContent(
      'Component testing is done with react-testing-library'
    )
  })

  test('clicking the button calls event handler once', () => {
    const note = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }

    const mockHandler = vitest.fn()

    const component = render(
      <Note note={note} toggleImportance={mockHandler} />
    )

    const button = component.getByText('make not important')
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
  })
})

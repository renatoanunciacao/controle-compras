import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import Button from './Button'
import userEvent from '@testing-library/user-event'

describe('Button (atom)', () => {
  it('deve renderizar o texto corretamente', () => {
    render(<Button>Salvar</Button>)

    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
  })

    it('deve chamar onClick quando clicado', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={onClick}>Clique</Button>)

    await user.click(screen.getByRole('button', { name: /clique/i }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

    it('deve estar desabilitado quando disabled for true', () => {
    render(<Button disabled>Desabilitado</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})



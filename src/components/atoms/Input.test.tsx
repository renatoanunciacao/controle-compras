import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import Input from './Input'
import userEvent from '@testing-library/user-event'

describe('Input (atom)', () => {
  it('deve renderizar o input com o label informado', () => {
    render(<Input label="Nome" value="Renato" onChange={() => {}} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/renato/i)).toBeInTheDocument();
   
  })

  it('deve chamar onChange ao alterar o valor do input', async () => {
    const mock = vi.fn()
    //o input começa com um valor "Renato"
    render(<Input label="Nome" value="Renato" onChange={mock} placeholder='Informe seu nome' />)

     const input = screen.getByLabelText(/nome/i)
  const user = userEvent.setup()

  await user.clear(input)
  await user.type(input, 'Ana')

  expect(mock).toHaveBeenCalled()
  expect(mock).toHaveBeenLastCalledWith(expect.any(String))
  }) 

  it('deve renderizar o placeholder quando informado', () => {
    render(<Input label="Nome" value="" onChange={() => {}} placeholder='Informe seu nome'  />)
    expect(screen.getByPlaceholderText(/informe seu nome/i)).toBeInTheDocument();
  })

  it('deve marcar o input como não obrigatório', () => {
    render(<Input label="Nome" value="" onChange={() => {}}  />)

    const input = screen.getByLabelText(/nome/i)

    expect(input).not.toBeRequired();
  })

  it('deve marcar o input como  obrigatório', () => {
    render(<Input label="Nome" value="" onChange={() => {}} required />)

    const input = screen.getByLabelText(/nome/i)

    expect(input).toBeRequired();
  })
})
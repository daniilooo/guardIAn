// @vitest-environment jsdom
import { MENSAGENS } from '@guardian/shared';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { prompt } from '../teste-fixtures.ts';
import { CartaoPrompt, momento } from './CartaoPrompt.tsx';
import { ModalOverride } from './ModalOverride.tsx';

afterEach(cleanup);

describe('CartaoPrompt', () => {
  it('mostra marcador com texto, nota e as 4 barras com valores (R4)', () => {
    render(<CartaoPrompt prompt={prompt({ score_total: 88 })} />);
    expect(screen.getByText('APROVADO')).toBeTruthy();
    expect(screen.getByText('88%')).toBeTruthy();
    for (const rotulo of ['Clareza do pedido', 'Onde mexer', 'O que fazer', 'Resultado esperado']) {
      expect(screen.getByText(rotulo)).toBeTruthy();
    }
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('retido com override: contador e botão "Aprovar manualmente" (R5/R6)', () => {
    const onAprovar = vi.fn();
    const p = prompt({
      status: 'BARRADO',
      block_reason: 'NOTA_BAIXA',
      final_decision: 'RETIDO',
      can_override: true,
      hold_expires_at: new Date(Date.now() + 30_000).toISOString(),
    });
    render(<CartaoPrompt prompt={p} onAprovar={onAprovar} />);
    expect(screen.getByText(/s para decidir/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Aprovar manualmente' }));
    expect(onAprovar).toHaveBeenCalledWith(p);
  });

  it('segredo nunca oferece override (D38)', () => {
    render(
      <CartaoPrompt
        prompt={prompt({
          status: 'BARRADO',
          block_reason: 'SEGREDO_DETECTADO',
          final_decision: 'BLOQUEADO',
          text_masked: 'use [SEGREDO:github_token]',
          scores: null,
          score_total: null,
        })}
        onAprovar={vi.fn()}
      />,
    );
    expect(screen.getByText('BARRADO — SEGREDO DETECTADO')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Aprovar manualmente' })).toBeNull();
  });

  it('retenção expirada esconde o botão', () => {
    render(
      <CartaoPrompt
        prompt={prompt({
          final_decision: 'RETIDO',
          can_override: true,
          hold_expires_at: '2020-01-01T00:00:00Z',
        })}
        onAprovar={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Aprovar manualmente' })).toBeNull();
  });
});

describe('ModalOverride (R6)', () => {
  it('exibe o aviso e os dois botões', () => {
    const acoes = { onEnviar: vi.fn(), onCancelar: vi.fn(), onFechar: vi.fn() };
    render(<ModalOverride prompt={prompt()} ocupado={false} {...acoes} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(MENSAGENS.overrideAviso)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mesmo assim' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(acoes.onEnviar).toHaveBeenCalledOnce();
    expect(acoes.onCancelar).toHaveBeenCalledOnce();
  });

  it('Esc fecha sem decidir', () => {
    const acoes = { onEnviar: vi.fn(), onCancelar: vi.fn(), onFechar: vi.fn() };
    render(<ModalOverride prompt={prompt()} ocupado={false} {...acoes} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(acoes.onFechar).toHaveBeenCalledOnce();
    expect(acoes.onEnviar).not.toHaveBeenCalled();
  });
});

describe('momento', () => {
  const agora = new Date('2026-10-15T15:00:00');
  it('só a hora para hoje', () => {
    expect(momento(new Date('2026-10-15T09:05:07').toISOString(), agora)).toBe('09:05:07');
  });
  it('data + hora para outros dias', () => {
    expect(momento(new Date('2026-10-13T09:05:07').toISOString(), agora)).toBe('13/10 09:05:07');
  });
});

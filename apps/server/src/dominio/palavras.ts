// R2 — conta apenas palavras com ao menos uma letra ou dígito (pontuação solta não conta).
const PALAVRA = /[\p{L}\p{N}]/u;

export function contarPalavras(texto: string): number {
  return texto.split(/\s+/).filter((token) => PALAVRA.test(token)).length;
}

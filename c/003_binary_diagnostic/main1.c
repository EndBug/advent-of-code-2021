#include <stdio.h>
#include <stdlib.h>
#define FN "input.txt"
#define NBIT 12
#define BASE2 2

int main() {
  FILE *fp;
  int count[NBIT], gammaBin[NBIT], i, error, pow2;
  char tmp[NBIT + 1];
  int gamma, epsilon;

  fp = fopen(FN, "r");

  if (fp) {
    for (i = 0; i < NBIT; i++)
      count[i] = 0;

    fscanf(fp, "%s", tmp);
    error = 0;

    while (!feof(fp) && !error) {
      for (i = 0; i < tmp[i] != '\0'; i++) {
        if (tmp[i] == '0')
          count[i]--;
        else if (tmp[i] == '1')
          count[i]++;
        else
          error = 1;
      }
      fscanf(fp, "%s", tmp);
    }

    if (!error) {
      for (i = 0; i < NBIT; i++) {
        if (count[i] >= 0)
          gammaBin[i] = 1;
        else
          gammaBin[i] = 0;
      }

      gamma = epsilon = 0;
      for (i = NBIT - 1, pow2 = 1; i >= 0; i--, pow2 *= BASE2) {
        if (gammaBin[i])
          gamma += pow2;
        else
          epsilon += pow2;
      }

      printf("[P1] gamma: %d, epsilon: %d, gamma*epsilon: %d\n", gamma, epsilon,
             gamma * epsilon);
    } else
      printf("[P1] File format error.\n");

    fclose(fp);
  } else
    printf("[P1] File access error.\n");

  return 0;
}

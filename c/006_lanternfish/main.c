#include <stdio.h>
#define FN "input.txt"
#define NEW_FISH_AGE 8
#define AGE_RESET 6
#define DIM NEW_FISH_AGE + 1

long long int simulate(long long int input[DIM], int days) {
  int i, j;
  long long int res[DIM], acc, tmp;

  for (i = 0; i < DIM; i++)
    res[i] = input[i];

  for (i = 1; i <= days; i++) {
    tmp = res[0];

    for (j = 0; j < DIM - 1; j++)
      res[j] = res[j + 1];

    res[AGE_RESET] += tmp;
    res[NEW_FISH_AGE] = tmp;
  }

  acc = 0;
  for (i = 0; i < DIM; i++)
    acc += res[i];

  return acc;
}

int main() {
  FILE *fp;
  long long int input[DIM], acc;
  int i, tmp;

  fp = fopen(FN, "r");

  if (fp) {
    for (i = 0; i < DIM; i++)
      input[i] = 0;

    fscanf(fp, "%d %*c", &tmp);
    while (!feof(fp)) {
      input[tmp]++;
      fscanf(fp, "%d %*c", &tmp);
    }
    input[tmp]++;

    acc = simulate(input, 80);
    printf("[P1] %lld\n", acc);
    acc = simulate(input, 256);
    printf("[P2] %lld\n", acc);

    fclose(fp);
  }

  return 0;
}

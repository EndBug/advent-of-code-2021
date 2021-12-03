#include <stdio.h>
#define FN "input.txt"

void partOne() {
  FILE *fp;
  int prev, curr, count;

  fp = fopen(FN, "r");
  if (fp) {
    fscanf(fp, "%d %d", &prev, &curr);
    count = 0;

    while (!feof(fp)) {
      if (curr > prev)
        count++;

      prev = curr;
      fscanf(fp, "%d", &curr);
    }

    printf("[P1] %d\n", count);

    fclose(fp);
  } else
    printf("[P1] File error.\n");
}

void partTwo() {
  FILE *fp;
  int prev, curr, count, a, b, c;

  fp = fopen(FN, "r");
  if (fp) {
    count = 0;

    fscanf(fp, "%d %d %d", &a, &b, &c);
    prev = a + b + c;
    a = b;
    b = c;
    fscanf(fp, "%d", &c);

    while (!feof(fp)) {
      curr = a + b + c;
      if (curr > prev)
        count++;

      prev = curr;
      a = b;
      b = c;
      fscanf(fp, "%d", &c);
    }

    printf("[P2] %d\n", count);

    fclose(fp);
  } else
    printf("[P2] File error.\n");
}

int main() {
  partOne();
  partTwo();

  return 0;
}

#include <stdio.h>
#include <string.h>
#define FN "input.txt"
#define L1 2
#define L4 4
#define L7 3
#define L8 7
#define INPUT_DIM 10
#define OUTPUT_DIM 4
#define BASE 10

void partOne();
void partTwo();
void add(char *a, char *b);
void sub(char *from, char *str);
int match(char *a, char *b);

int main() {
  partOne();
  partTwo();
  return 0;
}

void partOne() {
  FILE *fp;
  char input[INPUT_DIM][L8 + 1], output[OUTPUT_DIM][L8 + 1], tmpStr[L8 + 1];
  int i, count, l;

  fp = fopen(FN, "r");

  if (fp) {
    count = 0;

    fscanf(fp, "%s", input[0]);
    while (!feof(fp)) {
      for (i = 1; i < INPUT_DIM; i++)
        fscanf(fp, "%s", input[i]);
      fscanf(fp, "%s", tmpStr);
      for (i = 0; i < OUTPUT_DIM; i++)
        fscanf(fp, "%s", output[i]);

      for (i = 0; i < OUTPUT_DIM; i++) {
        l = strlen(output[i]);
        if (l == L1 || l == L4 || l == L7 || l == L8)
          count++;
      }

      fscanf(fp, "%s", input[0]);
    }

    printf("[P1] %d\n", count);

    fclose(fp);
  } else
    printf("[P1] File access error.\n");
}

void partTwo() {
  FILE *fp;
  char input[INPUT_DIM][L8 + 1], output[OUTPUT_DIM][L8 + 1], tmpStr[L8 + 1];
  int i, count, l, pot, digit;
  char A[L8 + 1], B[L8 + 1], C[L8 + 1], D[L8 + 1], E[L8 + 1], F[L8 + 1],
      G[L8 + 1];
  char n[INPUT_DIM][L8 + 1];

  fp = fopen(FN, "r");

  if (fp) {
    count = 0;

    fscanf(fp, "%s", input[0]);
    while (!feof(fp)) {
      for (i = 1; i < INPUT_DIM; i++)
        fscanf(fp, "%s", input[i]);
      fscanf(fp, "%s", tmpStr);
      for (i = 0; i < OUTPUT_DIM; i++)
        fscanf(fp, "%s", output[i]);

      for (i = 0; i < INPUT_DIM; i++) {
        switch (strlen(input[i])) {
        case L1:
          strcpy(n[1], input[i]);
          break;

        case L4:
          strcpy(n[4], input[i]);
          break;

        case L7:
          strcpy(n[7], input[i]);
          break;

        case L8:
          strcpy(n[8], input[i]);
          break;

        default:
          break;
        }
      }

      strcpy(A, n[7]);
      sub(A, n[1]);

      for (i = 0; i < INPUT_DIM; i++) {
        if (strlen(input[i]) == L8 - 1) {
          strcpy(tmpStr, n[8]);
          sub(tmpStr, input[i]);

          if (strstr(n[1], tmpStr))
            strcpy(n[6], input[i]);
          else if (strstr(n[4], tmpStr))
            strcpy(n[0], input[i]);
          else
            strcpy(n[9], input[i]);
        }
      }

      strcpy(C, n[8]);
      sub(C, n[6]);

      strcpy(D, n[8]);
      sub(D, n[0]);

      strcpy(B, n[4]);
      sub(B, n[1]);
      sub(B, D);

      strcpy(E, n[8]);
      sub(E, n[9]);

      strcpy(G, n[8]);
      sub(G, n[4]);
      sub(G, A);
      sub(G, E);

      strcpy(F, n[8]);
      sub(F, A);
      sub(F, B);
      sub(F, C);
      sub(F, D);
      sub(F, E);
      sub(F, G);

      strcpy(n[2], A);
      add(n[2], C);
      add(n[2], D);
      add(n[2], E);
      add(n[2], G);

      strcpy(n[3], A);
      add(n[3], C);
      add(n[3], D);
      add(n[3], F);
      add(n[3], G);

      strcpy(n[5], A);
      add(n[5], B);
      add(n[5], D);
      add(n[5], F);
      add(n[5], G);

      for (i = OUTPUT_DIM - 1, pot = 1; i >= 0; i--, pot *= BASE) {
        for (digit = 0; !match(output[i], n[digit]) && digit <= 9; digit++)
          ;
        count += digit * pot;
      }

      fscanf(fp, "%s", input[0]);
    }

    printf("[P2] %d\n", count);

    fclose(fp);
  } else
    printf("[P2] File access error.\n");
}

/*
  Do I know about stdarg? Yes.
  Will I bother updating this code? Probably not.
*/

void add(char *a, char *b) {
  char res[L8 + 1];
  int len;

  strcpy(res, a);
  len = strlen(res);

  for (; *b != '\0'; b++) {
    if (!strchr(res, *b)) {
      res[len] = *b;
      len++;
    }
  }
  res[len] = '\0';

  strcpy(a, res);
}

void sub(char *from, char *str) {
  char res[L8 + 1];
  int i, len;

  for (i = 0, len = 0; from[i] != '\0'; i++) {
    if (!strchr(str, from[i])) {
      res[len] = from[i];
      len++;
    }
  }
  res[len] = '\0';

  strcpy(from, res);
}

int match(char *a, char *b) {
  int res;

  res = strlen(a) == strlen(b);

  for (; res && *a != '\0'; a++) {
    if (!strchr(b, *a))
      res = 0;
  }

  return res;
}

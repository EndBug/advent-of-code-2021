#include <stdio.h>
#define FN "input.txt"
#define NR 100
#define NC 100
#define TLBDIM 3

void loadMap(int map[][NC], char *fn);
void partOne(int map[][NC]);
void partTwo(int map[][NC]);
void addDecreasing(int n, int a[], int dim);

int main() {
  int map[NR][NC];
  int i, j;

  loadMap(map, FN);
  partOne(map);
  partTwo(map);

  return 0;
}

void loadMap(int map[][NC], char *fn) {
  FILE *fp;
  char c;
  int i, j;

  fp = fopen(fn, "r");

  if (fp) {
    fscanf(fp, "%c", &c);
    i = j = 0;

    while (!feof(fp) && i < NR) {
      if (c != '\n') {
        map[i][j] = c - '0';
        j++;
      } else {
        i++;
        j = 0;
      }
      fscanf(fp, "%c", &c);
    }

    fclose(fp);
  } else
    printf("[loadMap] File access error.\n");
}

void partOne(int map[][NC]) {
  int i, j, risk, valid;

  risk = 0;
  for (i = 0; i < NR; i++) {
    for (j = 0; j < NC; j++) {
      valid = ((i <= 0 || map[i - 1][j] > map[i][j]) &&
               (i >= NR - 1 || map[i + 1][j] > map[i][j]) &&
               (j <= 0 || map[i][j - 1] > map[i][j]) &&
               (j >= NC - 1 || map[i][j + 1] > map[i][j]));

      if (valid)
        risk += 1 + map[i][j];
    }
  }

  printf("[P1] %d\n", risk);
}

void partTwo(int map[][NC]) {
  int i, j, k, res, isMin, size;
  int threeLargestBasins[TLBDIM] = {0};
  int alreadyChecked[NR * NC][2], acDim = 0;

  for (i = 0; i < NR; i++) {
    for (j = 0; j < NC; j++) {
      isMin = ((i <= 0 || map[i - 1][j] > map[i][j]) &&
               (i >= NR - 1 || map[i + 1][j] > map[i][j]) &&
               (j <= 0 || map[i][j - 1] > map[i][j]) &&
               (j >= NC - 1 || map[i][j + 1] > map[i][j]));

      if (isMin) {
        size = findBasinSize(map, i, j, alreadyChecked, &acDim);

        addDecreasing(size, threeLargestBasins, TLBDIM);
      }
    }
  }

  res = 1;
  for (i = 0; i < TLBDIM; i++) {
    res *= threeLargestBasins[i];
  }
  printf("[P2] %d\n", res);
}

int findBasinSize(int map[][NC], int i, int j, int alreadyChecked[][2],
                  int *acDim) {
  int k, tmpRes, res;

  for (k = 0; k < *acDim; k++) {
    if (alreadyChecked[k][0] == i && alreadyChecked[k][1] == j)
      return 0;
  }

  res = 1;

  alreadyChecked[*acDim][0] = i;
  alreadyChecked[*acDim][1] = j;
  (*acDim)++;

  if (i > 0 && map[i - 1][j] > map[i][j] && map[i - 1][j] < 9) {
    tmpRes = findBasinSize(map, i - 1, j, alreadyChecked, acDim);
    res += tmpRes;
  }
  if (i < NR - 1 && map[i + 1][j] > map[i][j] && map[i + 1][j] < 9) {
    tmpRes = findBasinSize(map, i + 1, j, alreadyChecked, acDim);
    res += tmpRes;
  }
  if (j > 0 && map[i][j - 1] > map[i][j] && map[i][j - 1] < 9) {
    tmpRes = findBasinSize(map, i, j - 1, alreadyChecked, acDim);
    res += tmpRes;
  }
  if (j < NC - 1 && map[i][j + 1] > map[i][j] && map[i][j + 1] < 9) {
    tmpRes = findBasinSize(map, i, j + 1, alreadyChecked, acDim);
    res += tmpRes;
  }

  return res;
}

void addDecreasing(int n, int a[], int dim) {
  int i, j;

  for (i = 0, j = -1; i < dim && j == -1; i++) {
    if (a[i] < n)
      j = i;
  }

  if (j != -1) {
    for (i = dim - 1; i > j; i--) {
      a[i] = a[i - 1];
    }
    a[j] = n;
  }
}

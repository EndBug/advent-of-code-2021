#include <stdio.h>
#define FN "input.txt"
#define DIM 1000

/* Does not run with GCC on Windows, I compiled it on Linux */

void partOne();
void partTwo();
int min(int, int);
int max(int, int);

int main() {
  partOne();
  partTwo();
  return 0;
}

void partOne() {
  FILE *fp;
  int mat[1000][1000];
  int i, j, tmp;
  int rowStart, colStart, rowEnd, colEnd;

  fp = fopen(FN, "r");

  if (fp) {
    for (i = 0; i < DIM; i++)
      for (j = 0; j < DIM; j++)
        mat[i][j] = 0;

    fscanf(fp, "%d %*c %d %*s %d %*c %d", &colStart, &rowStart, &colEnd,
           &rowEnd);
    while (!feof(fp)) {
      if (rowStart == rowEnd) {
        if (colStart > colEnd) {
          tmp = colStart;
          colStart = colEnd;
          colEnd = tmp;
        }

        for (i = colStart; i <= colEnd; i++)
          mat[rowStart][i]++;
      } else if (colStart == colEnd) {
        if (rowStart > rowEnd) {
          tmp = rowStart;
          rowStart = rowEnd;
          rowEnd = tmp;
        }

        for (i = rowStart; i <= rowEnd; i++)
          mat[i][colStart]++;
      }
      fscanf(fp, "%d %*c %d %*s %d %*c %d", &colStart, &rowStart, &colEnd,
             &rowEnd);
    }

    tmp = 0;
    for (i = 0; i < DIM; i++) {
      for (j = 0; j < DIM; j++) {
        if (mat[i][j] > 1)
          tmp++;
      }
    }
    printf("[P1] %d\n", tmp);

    fclose(fp);
  } else
    printf("[P1] File access error.\n");
}

void partTwo() {
  FILE *fp;
  int mat[1000][1000];
  int i, j, tmp;
  int rowStart, colStart, rowEnd, colEnd;

  fp = fopen(FN, "r");

  if (fp) {
    for (i = 0; i < DIM; i++)
      for (j = 0; j < DIM; j++)
        mat[i][j] = 0;

    fscanf(fp, "%d %*c %d %*s %d %*c %d", &colStart, &rowStart, &colEnd,
           &rowEnd);
    while (!feof(fp)) {
      int row, col;
      int minRow, maxRow, minCol, maxCol;

      row = rowStart;
      col = colStart;
      minRow = min(rowStart, rowEnd);
      maxRow = max(rowStart, rowEnd);
      minCol = min(colStart, colEnd);
      maxCol = max(colStart, colEnd);

      while (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol) {
        mat[row][col]++;

        if (rowStart < rowEnd)
          row++;
        else if (rowStart > rowEnd)
          row--;

        if (colStart < colEnd)
          col++;
        else if (colStart > colEnd)
          col--;

        if (rowStart == rowEnd && colStart == colEnd)
          break;
      }

      fscanf(fp, "%d %*c %d %*s %d %*c %d", &colStart, &rowStart, &colEnd,
             &rowEnd);
    }

    tmp = 0;
    for (i = 0; i < DIM; i++) {
      for (j = 0; j < DIM; j++) {
        if (mat[i][j] > 1)
          tmp++;
      }
    }
    printf("[P2] %d\n", tmp);

    fclose(fp);
  } else
    printf("[P2] File access error.\n");
}

int min(int a, int b) {
  if (a < b)
    return a;
  else
    return b;
}

int max(int a, int b) {
  if (a > b)
    return a;
  else
    return b;
}

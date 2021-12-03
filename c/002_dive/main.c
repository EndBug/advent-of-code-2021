#include <stdio.h>
#include <string.h>
#define FN "input.txt"

#define FORWARD "forward"
#define UP "up"
#define DOWN "down"
#define MAXS 7

void partOne() {
  FILE *fp;
  int x, d, tmp;
  char cmd[MAXS + 1];

  fp = fopen(FN, "r");
  if (fp) {
    fscanf(fp, "%s %d", cmd, &tmp);
    x = d = 0;

    while (!feof(fp)) {
      if (!strcmp(cmd, FORWARD)) {
        x += tmp;
      } else if (!strcmp(cmd, UP)) {
        d -= tmp;
      } else if (!strcmp(cmd, DOWN)) {
        d += tmp;
      }

      fscanf(fp, "%s %d", cmd, &tmp);
    }

    printf("[P1] x: %d, d: %d, x*d: %d\n", x, d, x * d);

    fclose(fp);
  } else
    printf("[P1] File error.\n");
}

void partTwo() {
  FILE *fp;
  int x, d, aim, tmp;
  char cmd[MAXS + 1];

  fp = fopen(FN, "r");
  if (fp) {
    fscanf(fp, "%s %d", cmd, &tmp);
    x = d = aim = 0;

    while (!feof(fp)) {
      if (!strcmp(cmd, FORWARD)) {
        x += tmp;
        d += tmp * aim;
      } else if (!strcmp(cmd, UP)) {
        aim -= tmp;
      } else if (!strcmp(cmd, DOWN)) {
        aim += tmp;
      }

      fscanf(fp, "%s %d", cmd, &tmp);
    }

    printf("[P2] x: %d, d: %d, x*d: %d\n", x, d, x * d);

    fclose(fp);
  } else
    printf("[P2] File error.\n");
}

int main() {
  partOne();
  partTwo();

  return 0;
}

#include <stdio.h>
#include <string.h>

int main() {
  char c = 'a';
  printf("%d\n", strlen(&c));
  return 0;
}

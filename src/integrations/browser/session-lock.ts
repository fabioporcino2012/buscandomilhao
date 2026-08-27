export function createSessionLock() {
  let locked = false;

  return {
    acquire() {
      if (locked) {
        throw new Error("Instagram session is already in use");
      }

      locked = true;
      let released = false;
      return () => {
        if (!released) {
          locked = false;
          released = true;
        }
      };
    },
  };
}

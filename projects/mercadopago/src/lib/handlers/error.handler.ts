export function logError(target: any, key: string, desc: PropertyDescriptor) {
  const method = desc.value;

  // tslint:disable-next-line:only-arrow-functions
  desc.value = function() {
    try {
      method();
    } catch (error) {
      console.log(error);
    }
  };
}

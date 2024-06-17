import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { ConfirmDialogService } from '../confirm-dialog.service';
import { ConfirmDialogData } from '../interfaces/confirm-dialog-data.interface';

const defaultConfirmData = {
  title: 'Confirmation',
  message: 'Are you sure you want to perform this action?',
};

export function needConfirmation(
  confirmData: ConfirmDialogData = defaultConfirmData
) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any) {
      ConfirmDialogService.getInstance()
        ?.openDialog(confirmData, ConfirmDialogComponent)
        .subscribe((validation) => {
          if (validation) {
            originalMethod.apply(this, args);
          }
        });
    };

    return descriptor;
  };
}

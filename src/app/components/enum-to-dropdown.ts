import { Dropdown } from '../models/task';

/**
 * Transforms an enum into an array of objects with label and value properties.
 * @param enumObject The enum to transform
 * @param labelFormatter Optional function to format the label (defaults to capitalized enum key)
 * @returns Array of objects with { label: string, value: number | string }
 */
export function enumToDropdown<T extends object>(
  enumObject: T,
  labelFormatter?: (key: string) => string
): Dropdown[] {
  // Helper function to determine if the enum is string or numeric
  const isStringEnum = Object.values(enumObject).some(value => typeof value === 'string');

  return Object.keys(enumObject)
    // For numeric enums, filter out the reverse mappings
    .filter(key => isStringEnum || isNaN(Number(key)))
    .map(key => {
      // Create label from key using formatter or default format
      const label = labelFormatter
        ? labelFormatter(key)
        : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

      return {
        label,
        value: enumObject[key as keyof T]
      };
    });
}
export function dropdownOptionsFromEnum<T>(targetEnum: T): Dropdown[] {
  return Object.keys(targetEnum as any)
    .filter((key: string | number) => {
      return isNaN(Number(key)) && key !== 'null';
    })
    .map((key: string) => {
      return {label: key, value: (targetEnum as any)[key]} as Dropdown;
    });
}

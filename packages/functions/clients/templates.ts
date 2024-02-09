import fs from 'fs';
import { join } from 'path';
import { TruckupInternalServerErrorError } from 'src/errors';

// eslint-disable-next-line import/no-self-import
export * as templates from './templates';

type TTemplateName =
  | 'headerTemplate'
  | 'footerTemplate'
  | 'contentTemplate'
  | 'vehicleTemplate'
  | 'serviceTemplate'
  | 'partTemplate'
  | 'serviceSubTotalTemplate';

export type TTemplates = Record<TTemplateName, string>;

const load = (name: string) => {
  const path = join(__dirname, '..', 'invoice-templates', name);
  return fs.readFileSync(path, 'utf8');
};

let _templates: Record<TTemplateName, string> | null = null;
export const useTemplates = async () => {
  if (!_templates) {
    const [
      headerTemplate,
      footerTemplate,
      contentTemplate,
      vehicleTemplate,
      serviceTemplate,
      partTemplate,
      serviceSubTotalTemplate,
    ] = await Promise.all([
      load('header-main.html'),
      load('footer.html'),
      load('content.html'),
      load('section-vehicle.html'),
      load('section-service.html'),
      load('section-part.html'),
      load('section-service-subtotal.html'),
    ]);

    if (
      !headerTemplate ||
      !footerTemplate ||
      !contentTemplate ||
      !vehicleTemplate ||
      !serviceTemplate ||
      !partTemplate ||
      !serviceSubTotalTemplate
    )
      throw new TruckupInternalServerErrorError();

    _templates = {
      headerTemplate,
      footerTemplate,
      contentTemplate,
      vehicleTemplate,
      serviceTemplate,
      partTemplate,
      serviceSubTotalTemplate,
    };
  }

  return _templates;
};

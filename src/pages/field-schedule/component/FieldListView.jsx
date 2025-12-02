import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FieldListView = ({ fields, onViewDetails, onBookField }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields?.map((field) => (
        <div
          key={field?.id}
          className="bg-card rounded-lg border border-border shadow-sm overflow-hidden booking-card-hover"
        >
          {/* Field Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={field?.image}
              alt={field?.imageAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                {field?.type}
              </div>
            </div>
            {field?.indoor && (
              <div className="absolute top-3 left-3">
                <div className="px-3 py-1 bg-success text-success-foreground rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Icon name="Home" size={12} />
                  <span>Indoor</span>
                </div>
              </div>
            )}
          </div>

          {/* Field Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">{field?.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {field?.description}
            </p>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Maximize" size={14} />
                <span>{field?.size}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Users" size={14} />
                <span>{field?.capacity}</span>
              </div>
            </div>

            {/* Amenities Preview */}
            <div className="flex items-center space-x-2 mb-4">
              {field?.amenities?.slice(0, 3)?.map((amenity, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-muted rounded text-xs text-foreground"
                >
                  {amenity}
                </div>
              ))}
              {field?.amenities?.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{field?.amenities?.length - 3} lainnya
                </span>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Harga per Jam</p>
                <p className="text-xl font-bold text-primary">
                  Rp {field?.price?.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Info"
                  onClick={() => onViewDetails(field)}
                />
                <Button
                  variant="default"
                  size="sm"
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => onBookField(field)}
                >
                  Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FieldListView;
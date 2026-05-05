import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseDocumentEntity } from '../common/common.entity';
import { LicensingInfo } from '../licensing-info/licensing-info.entity';
import { DocumentType } from './agent-document.enums';

@Entity({ name: 'agent_documents' })
export class AgentDocument extends AbstractBaseDocumentEntity {
  @Column({
    type: 'enum',
    enum: DocumentType,
    nullable: true,
  })
  documentType: DocumentType;

  @ManyToOne(
    () => LicensingInfo,
    (licensingInfo) => licensingInfo.agentDocuments,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'licensing_info_id' })
  licensingInfo: LicensingInfo;

  @Column({ nullable: true })
  licensingInfoId: number;
}
